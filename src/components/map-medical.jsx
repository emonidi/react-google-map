import { useCallback, useEffect, useState } from 'react';
import { center, bbox, centerOfMass } from '@turf/turf';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { providerStates } from './provider-states';

export const MapMedical = (props) => {
    let [states, setStates] = useState([]);
    let [mapCenter, setMapCenter] = useState();
    let [bounds, setBounds] = useState({
        north:49.3457868,
        east:-124.7844079,
        west:-66.9513812,
        south:24.7433195
    });

    useEffect(() => {
        if (props.states) {
            let states = props.states.features.map(s => {
                let stateName = s.properties.NAME;
                if (providerStates.some(s => s.name === stateName)) {
                    s.properties.hasProvider = true;
                }
            })
            states = {
                ...props.states, features: props.states.features.filter(
                    f => f.properties.NAME !== "Alaska" &&
                        f.properties.NAME !== "Hawaii" &&
                        f.properties.NAME !== "Puerto Rico")
            };
            setStates(states);
            let c = center(states);
           
            setMapCenter(c);

            
        }
    }, [props.states])


    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDSXCx4tmYvMCpDnapBqmo2jsUyM8ePHTc"
    })

    const onload = useCallback(function onLoad(map) {
        let data = map.data.addGeoJson(states);
        map.data.setStyle({
            fillColor: 'transparent',
            strokeColor: 'red',
            strokeWeight: 1,
            strokeOpacity: .25
        });

        map.data.addListener('mouseover', function (event) {
            map.data.overrideStyle(event.feature, { fillColor: "green" })
        });

        map.data.addListener('mouseout', function (event) {
            map.data.overrideStyle(event.feature, { fillColor: "transparent" })
        });
      
        let bounds = new google.maps.LatLngBounds();
        states.features.forEach(state => {
            let c = centerOfMass(state).geometry.coordinates;
            bounds.extend({lat:c[1],lng:c[0]})
            if (state.properties.hasProvider) {
                let p = centerOfMass(state).geometry.coordinates;

                new google.maps.Marker({
                    position: { lat: p[1], lng: p[0] },
                    map: map,
                    icon: "https://cdn-icons-png.flaticon.com/32/179/179571.png",
                    title: "Blah"
                })
            }
        })
        map.fitBounds(bounds,50)

    })

    const renderMap = () => {

        let center = mapCenter.geometry.coordinates;
        console.log(bounds)
        return (
            <GoogleMap
                id="map"
                onLoad={onload}
                center={{
                    lat: center[1],
                    lng: center[0]
                }}
                mapContainerStyle={{
                    height: props.width + "px",
                    width: props.height + "px"
                }}
                zoom={props.zoom}
            >

                {/* <Rectangle bounds={bounds}></Rectangle> */}
            </GoogleMap>
        )
    }



    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    return isLoaded ? renderMap() : <span>Loading</span>
}