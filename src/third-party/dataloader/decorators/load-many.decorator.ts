import { RelationMetadata, RelationNodeFn, RelationType } from 'src/third-party/dataloader/types';
import { DataloaderMetadataContainer } from 'src/third-party/dataloader/utils';
import { Type } from '@nestjs/common';

interface LoadManyOptions<Child, Parent> {
  by: keyof Parent;
  where: keyof Child | string;
  on: string;
}

export function LoadMany<Child, Parent>(child: RelationNodeFn<Child>, options: LoadManyOptions<Child, Parent>) {
  const { by, where, on } = options;
  return function (target: NonNullable<any>, propertyKey: string) {
    const parent = target.constructor as Type;

    DataloaderMetadataContainer.AddRelationMetadata(
      () => parent,
      child,
      propertyKey,
      new RelationMetadata({
        by: by as string,
        where: where as string,
        type: RelationType.OneToMany,
        on: on,
      }),
    );
  };
}
