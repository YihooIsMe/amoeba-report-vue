import Mock from 'mockjs';
import threeAreasData from './threeAreas.json';

Mock.mock('http://10.100.250.153:99/api/Organization', 'get', function () {
  return Mock.mock(threeAreasData);
});
