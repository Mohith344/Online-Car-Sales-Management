import { faker } from '@faker-js/faker';

function createRandomCarList() {
  return {
    name: faker.vehicle.vehicle(),
    fuelType: faker.vehicle.fuel(),
    model: faker.vehicle.model(), // Changed 'Model' to 'model' for consistency
    type: faker.vehicle.type(),
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cgM0BEn24230ofOuyqCuddkxsj1z-Ug2WQ&s', // Corrected 'imgae' to 'image'
    miles: 1000,
    gearType: 'Automatic',
    price: faker.finance.amount({ min: 5000, max: 100000 })
  };
}

const carList = faker.helpers.multiple(createRandomCarList, {
  count: 7
});

export default { carList };