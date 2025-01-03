declare module '*.svg' {
  import type {IconType} from './src/types';

  const content: IconType;
  export default content;
}

declare module '*.json' {
  const content;
  export default content;
}

declare module '*.png' {
  const content;
  export default content;
}

declare module '*.jpg' {
  const content;
  export default content;
}
