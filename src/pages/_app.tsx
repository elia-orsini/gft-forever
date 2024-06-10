import Layout from "@/app/layout";
import "../../styles/global.css";

const App: React.FC<{ user: any; Component: any; pageProps: any }> = ({
  user,
  Component,
  pageProps,
}) => {
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
};

export default App;
