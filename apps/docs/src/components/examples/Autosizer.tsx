import { Autosizer } from '@react-awesome/components'

export const AutosizerExample = () => {
  return (
    <div className="w-full h-[600px]">
      <Autosizer>
        {({ width, height }) => (
          <div>
            <div className="flex">Width: {width}px</div>
            <div className="flex">Height: {height}px</div>
          </div>
        )}
      </Autosizer>
    </div>
  )
}
