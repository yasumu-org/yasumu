import { AppView } from '@/components/layout/app-view';
import { Content } from '@/components/layout/content';
import RequestInitializer from './(components)/request/input/request-initializer';
import ResponseViewer from './(components)/response/response-viewer';
import HistoryTree from './(components)/history/history-tree';

export default function Page() {
  return (
    <Content>
      <AppView tree={<HistoryTree />} editor={<RequestInitializer />} output={<ResponseViewer />} lazy={true} />
    </Content>
  );
}
