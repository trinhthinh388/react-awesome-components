export type TypeWriterSequenceObj = {
  duration: number
}

export type TypeWriterAnimatedTextProps<
  Tag extends keyof JSX.IntrinsicElements = 'p',
> = {
  /**
   * @description AnimatedText html tag to render
   * @default p
   * @requires false
   */
  as?: Tag
  sequences?: (string | TypeWriterSequenceObj)[]
} & JSX.IntrinsicElements[Tag]
