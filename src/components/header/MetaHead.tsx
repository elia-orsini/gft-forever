import Head from "next/head";

const MetaHead: React.FC = () => {
  return (
    <Head>
      <title>gft forever</title>
      <meta name="title" content={"gft forever"} />
      <meta property="og:title" content={"gft forever"} />

      <meta name="description" content={"gft forever"} />
      <meta property="og:description" content={"gft forever"} />
      <meta property="og:description" content={"gft forever"} />

      <meta property="og:image" content={"/thumb.png"} />
      <meta property="twitter:image" content={"/thumb.png"} />
    </Head>
  );
};

export default MetaHead;
