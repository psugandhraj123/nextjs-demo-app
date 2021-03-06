import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from 'next/head'
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description}/>
      </Head>
      <MeetupDetail
      title={props.meetupData.title}
      description={props.meetupData.description}
      address={props.meetupData.address}
      image={props.meetupData.image}
    />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect("mongodb+srv://Sugandh:test123@cluster0.nvmtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect("mongodb+srv://Sugandh:test123@cluster0.nvmtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })
  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  }
}

export default MeetupDetails;
