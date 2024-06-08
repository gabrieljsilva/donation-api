import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { Faker } from 'src/third-party/factory/interfaces';
import { FACTORY_FIELD } from 'src/third-party/factory/constants/metadata-keys.constants';

type FactoryFieldValueFn = (faker: Faker) => any;

export interface FactoryFieldMetadata {
  property: string;
  getValueFN: FactoryFieldValueFn;
}

export function FactoryField(getValueFn: FactoryFieldValueFn) {
  return (target: NonNullable<any>, propertyKey: string) => {
    const metadata: FactoryFieldMetadata = {
      property: propertyKey,
      getValueFN: getValueFn,
    };

    extendArrayMetadata(FACTORY_FIELD, [metadata], target.constructor);
  };
}
