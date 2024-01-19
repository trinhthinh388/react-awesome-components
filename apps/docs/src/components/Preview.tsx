import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { themes } from 'prism-react-renderer';

export const Preview = ({
  code,
  scope,
}: {
  code: string;
  scope: Record<string, unknown>;
}) => (
  <LiveProvider code={code} scope={scope}>
    <div className="border p-3 rounded-lg mb-2">
      <LivePreview />
    </div>
    <LiveError />
    <div className="rounded-lg overflow-hidden">
      <LiveEditor theme={themes.okaidia} />
    </div>
  </LiveProvider>
);
