import Head from 'next/head'
import { MongoClient } from 'mongodb';

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';


function HomePage(props) {
  return <Fragment>
    <Head>
      <title>Add a new Meetup</title>
      <meta name='description' content='Browse a list of highly active react meetups!'/>
    </Head>
  <MeetupList meetups={props.meetups} />
  </Fragment>;
}

export async function getStaticProps() {
  const client = await MongoClient.connect("mongodb+srv://Sugandh:test123@cluster0.nvmtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props:{
      meetups: meetups.map(meetup =>({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate:1
  };
}
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     }
//   };
// }
export default HomePage;
