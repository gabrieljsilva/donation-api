import 'reflect-metadata';
import { FactoryField } from 'src/third-party/factory/decorators/factory-field.decorator';
import {
  FactoryRelationField,
  FactoryRelationMetadata,
} from 'src/third-party/factory/decorators/factory-relation-field.decorator';
import { FACTORY_FIELD, FACTORY_RELATION } from 'src/third-party/factory/constants';

describe('FactoryRelationField tests', () => {
  it('should add relation metadata to field', () => {
    class DummyRelationEntity {
      @FactoryField(() => 'Hello World')
      message: string;
    }

    class DummyEntity {
      @FactoryRelationField(() => DummyRelationEntity)
      field: DummyRelationEntity;
    }

    const [metadata] = Reflect.getMetadata(FACTORY_RELATION, DummyEntity) as Array<FactoryRelationMetadata>;
    const type = metadata.returnTypeFn();
    expect(type).toBe(DummyRelationEntity);
    expect(metadata.property).toBe('field');

    const [relationMetadata] = Reflect.getMetadata(FACTORY_FIELD, DummyRelationEntity);
    expect(relationMetadata.property).toBe('message');
    expect(relationMetadata.getValueFN).toBeInstanceOf(Function);
  });
});
