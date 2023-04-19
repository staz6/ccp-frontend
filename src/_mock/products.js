import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Storage space',
  'Virtual Machines'
];
const img = [
  'vm.webp',
  'storage.webp'
]
const type = [
  'storage',
  'vm'
]
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const products = PRODUCT_NAME.map((_, index) => ({
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/${img[index]}`,
    name: PRODUCT_NAME[index],
    type: type[index]
  }));

export default products;
