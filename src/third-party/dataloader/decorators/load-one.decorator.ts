import { RelationMetadata, RelationNodeFn, RelationType } from 'src/third-party/dataloader/types';
import { DataloaderMetadataContainer } from 'src/third-party/dataloader/utils';
import { Type } from '@nestjs/common';

interface LoadOneOptions<Child, Parent> {
  by: string | keyof Parent;
  where: string | keyof Child;
  on: string;
}

export function LoadOne<Child, Parent>(child: RelationNodeFn<Child>, options: LoadOneOptions<Child, Parent>) {
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
        type: RelationType.OneToOne,
        on: on,
      }),
    );
  };
}
