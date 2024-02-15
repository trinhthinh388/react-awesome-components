import classNames from 'classnames'
import { Resizable } from 're-resizable'

export const Container = ({
  children,
  showSizeHandler = false,
}: {
  children: React.ReactNode
  showSizeHandler?: boolean
}) => {
  if (showSizeHandler) {
    return (
      <Resizable
        bounds="parent"
        enable={{
          right: true,
        }}
        maxWidth="98%"
        minWidth="30%"
        handleComponent={{
          right: (
            <div
              className="pointer-events-auto absolute top-1/2 -translate-y-1/2 hidden ml-3 md:block cursor-ew-resize"
              draggable={false}
              style={{
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
            >
              <div className="w-1.5 h-8 bg-slate-500/60 rounded-full"></div>
            </div>
          ),
        }}
      >
        <div className={classNames('mt-5 border rounded-lg p-4')}>
          {children}
        </div>
      </Resizable>
    )
  }

  return <div className="mt-5 border rounded-lg p-4">{children}</div>
}
