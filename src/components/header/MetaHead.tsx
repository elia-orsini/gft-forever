import Head from "next/head";

const MetaHead: React.FC = () => {
  return (
    <Head>
      <title>gft forever</title>
      <meta name="title" content={"gft forever !!!!!"} />
      <meta property="og:title" content={"gft forever !!!!!"} />

      <meta name="description" content={"gft forever !!!!! - an archive of all the films shown at gft in the past year."} />
      <meta property="og:description" content={"gft forever !!!!! - an archive of all the films shown at gft in the past year."} />
      <meta property="og:description" content={"gft forever !!!!! - an archive of all the films shown at gft in the past year."} />

      <meta property="og:image" content={"/gft.png"} />
      <meta property="twitter:image" content={"/gft.png"} />
    </Head>
  );
};

export default MetaHead;
