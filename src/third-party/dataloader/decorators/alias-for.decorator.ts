import { RESOLVE_DATALOADER_PROVIDER } from '../constants';

// todo -> Turn it into a function to prevent circular dependencies errors
export function AliasFor(provider: NonNullable<unknown>) {
  return (target: NonNullable<unknown>) => {
    Reflect.defineMetadata(RESOLVE_DATALOADER_PROVIDER, provider, target);
  };
}
