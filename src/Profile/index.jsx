import Header from "@/components/header";
import React from "react";
import "../index.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListing from "./components/MyListing";
import Inbox from "./components/Inbox";
import ProfileTab from "./components/ProfileTab";

function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="px-10 py-14 md:px-20 my-10">
        <Tabs defaultValue="my-listing" className="w-full  justify-start">
          <TabsList>
            <TabsTrigger value="my-listing">My Listing</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="my-listing">
          <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>

        
      </div>
    </div>
  );
}

export default Profile;
