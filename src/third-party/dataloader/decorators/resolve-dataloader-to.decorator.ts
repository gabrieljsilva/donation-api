import { RESOLVE_DATALOADER_PROVIDER } from '../constants';

export function ResolveProvider(provider: NonNullable<unknown>) {
  return (target: NonNullable<unknown>) => {
    Reflect.defineMetadata(RESOLVE_DATALOADER_PROVIDER, provider, target);
  };
}
