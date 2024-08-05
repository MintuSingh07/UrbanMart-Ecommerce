const getUsersWithinRadius = async (latitude, longitude, radiusInKm) => {
    const radiusInRadians = radiusInKm / 6378.1; // Radius in kilometers divided by Earth's radius in kilometers
  
    try {
      const users = await User.find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusInRadians],
          },
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching users within radius:', error);
      throw error;
    }
  };
  
  // Example usage:
  const latitude = 37.7749; // Replace with your lab's latitude
  const longitude = -122.4194; // Replace with your lab's longitude
  const radiusInKm = 5;
  
  getUsersWithinRadius(latitude, longitude, radiusInKm)
    .then(users => console.log('Users within 5 km:', users))
    .catch(error => console.error(error));