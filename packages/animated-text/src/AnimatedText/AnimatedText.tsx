export type AnimatedTextProps<Tag extends keyof JSX.IntrinsicElements = 'p'> = {
  /**
   * @description AnimatedText html tag to render
   * @default p
   * @requires false
   */
  as?: Tag
  children?: React.ReactNode
  type?: 'typewriter'
} & Omit<JSX.IntrinsicElements[Tag], 'type'>

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  as: Element = 'p',
  children,
  type = 'typewriter',
}) => {
  return <Element>{children}</Element>
}
