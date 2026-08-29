import type { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [elemName: string]: any
      }
    }
  }

  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [elemName: string]: any
    }
  }
}
