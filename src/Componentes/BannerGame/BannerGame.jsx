import React, { useEffect, useState } from 'react';
import '../BannerGame/BannerGame.css';

import image1 from '../../Images/01.png';
import image2 from '../../Images/02.png';
import image3 from '../../Images/03.png';
import image4 from '../../Images/04.png';
import image5 from '../../Images/05.png';
import image6 from '../../Images/06.png';
import image7 from '../../Images/07.png';
import image8 from '../../Images/08.png';

const BannerGame = () => {
    const images = [image1, image2, image3, image4, image5, image6, image7, image8];
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    useEffect(() => {
        const imgElements = images.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        let imagesLoadedCount = 0;
        imgElements.forEach((img) => {
            img.onload = () => {
                imagesLoadedCount++;
                if (imagesLoadedCount === images.length) {
                    setAllImagesLoaded(true);
                }
            };
        });
    }, [images]);

    return (
        <div className="images-barte">
            {allImagesLoaded && (
                <div className="images-bar-track">
                    {images.concat(images).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`image-${index}`}
                            className="bar-image"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerGame;