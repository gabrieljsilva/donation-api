import 'reflect-metadata';
import { FactoryField } from 'src/third-party/factory/decorators/factory-field.decorator';
import { FACTORY_FIELD } from 'src/third-party/factory/constants';

describe('FactoryField tests', () => {
  it('should add metadata field', () => {
    const getValueFn = () => 'Hello World';
    class DummyEntity {
      @FactoryField(getValueFn)
      field: string;
    }

    const metadata = Reflect.getMetadata(FACTORY_FIELD, DummyEntity);
    expect(metadata).toEqual([
      {
        property: 'field',
        getValueFN: getValueFn,
      },
    ]);
  });
});
