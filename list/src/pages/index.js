import React, { useEffect, useState } from "react";

function Information() {
  const [breeds, setBreeds] = useState([]);
  const [breedImages, setBreedImages] = useState([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const apiKey = 'live_KubpQHMVPIU2VKXB7kjzYzhEphhPEJnmcwLIJSyCSFLhmyLqNuc0f3dr5gzteb2Z';
        const response = await fetch(`https://api.thedogapi.com/v1/breeds?limit=100&page=0&api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data`);
        }
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error(`Error fetching data:`, error.message);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchImagesForBreeds = async () => {
      const images = await Promise.all(
        breeds.map(async (breed) => {
          try {
            const response = await fetch(
              `https://api.thedogapi.com/v1/images/${breed.reference_image_id}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch image data`);
            }
            const imageData = await response.json();
            return { breedId: breed.id, image: imageData.url, name: breed.name, temperament: breed.temperament };
          } catch (error) {
            console.error(`Error fetching image data for ${breed.name}:`, error.message);
            return { breedId: breed.id, image: null, name: breed.name, temperament: breed.temperament };
          }
        })
      );

      setBreedImages(images);
    };

    fetchImagesForBreeds();
  }, [breeds]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      {breedImages.map((breed) => (
        <div key={breed.breedId} style={{ marginTop: '100px', marginBottom: '10px', maxWidth: '300px' }}>
          <img src={breed.image} alt="Card" style={{ width: '80%', height: '80%' }} />
          <div style={{ padding: '10px' }}>
            <h3>{breed.name}</h3>
            <p>{breed.temperament}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Information;
