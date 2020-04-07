import React from 'react';
import { useEffect } from 'react';
import '../style/FaceFilter.style.css';

import {
    IntializeEngine, IntializeThreejs
} from './render.js';


const $ = window.$;

export const FaceFilter = () => {

    const handleReady = () => {
        let input = document.getElementsByClassName('initCamera')[0]
        input.value = "BEGIN"
        input.disabled = false;
    }

    var video;

    useEffect(() => {



        function onLoadCompleted() {

            $('.loadingMessage').fadeOut();
            // Change component
            handleReady()
        }




        async function init() {
            video = document.getElementById('facemesh-video');

            await navigator.mediaDevices.getUserMedia({
                'audio': false,
                'video': {
                    facingMode: 'user',

                }
            }).then(stream => {
                video.srcObject = stream;
            });



            video.oncanplay = (e) => {

                video.play();
                IntializeThreejs();
                IntializeEngine();
                onLoadCompleted();



            }



        }



        init();

        return () => {

        };
    }, []);




    return (
        <div className="row arcomp">
            <div className="loadingMessage">
                <p>fetching...</p>
            </div>
            <div id="threejsContainer">
                <video id="facemesh-video"></video>
            </div>
        </div>

    )
}