import type { Route } from '../../+types/root';

export namespace Route {
  export interface LoaderArgs {
    params: {
      id: string;
    };
    request: Request;
    context: Route.LoaderArgs['context'];
  }

  export interface ActionArgs {
    params: {
      id: string;
    };
    request: Request;
    context: Route.ActionArgs['context'];
  }
} 