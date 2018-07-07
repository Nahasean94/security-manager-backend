/**
 * This file contains database queries. We use the schemas defined in the schemas to CRUD within MongoDB
 */

"use strict"
const {Guard, Salary, Message, AttendanceRegister, Location,Admin} = require('./schemas')//import various models
const mongoose = require('mongoose')//import mongoose library
const bcrypt = require('bcrypt')//import bcrypt to assist hashing passwords
//Connect to Mongodb

mongoose.connect('mongodb://localhost/security_manager', {promiseLibrary: global.Promise})

const queries = {

    storeUpload: async function (path, caption, uploader) {
        return await new Upload({
            path: path,
            uploader: uploader,
            timestamp: new Date(),
            caption: caption,
        }).save()
    },
    updateProfile: async function (id, profile) {

        return await Guard.findOneAndUpdate({_id: id}, {
            username: profile.username,
            email: profile.email,

        }).exec()
    },
    storeComment: async function (author, comment) {
        return await new Comment({
            author: author,
            body: comment.comment,
            podcast: comment.podcast_id,
            timestamp: new Date()
        }).save()
    },
    updatePodcast: async function (podcast) {
        return await Podcast.findOneAndUpdate({
            _id: podcast.id
        }, {
            body: podcast.body,
            status: 'edited',
            timestamp: new Date()
        }, {new: true}).exec()
    },
    likeComment: async function (ctx, id) {
        return await Comment.findOneAndUpdate({
            _id: id,
            author: {$ne: ctx.currentGuard.id},
            'likes.liked_by': {$ne: ctx.currentGuard.id}

        }, {
            $push: {
                likes: {
                    liked_by: ctx.currentGuard.id
                }
            }
        }, {new: true}).exec()
    },
    unlikePodcast: async function (unliker, id) {
        return await Podcast.findOneAndUpdate({
            _id: id
        }, {
            $pull: {
                likes: {
                    liked_by: unliker
                }
            }
        }, {new: true}).exec()
    },
    likePodcast: async function (liker, id) {
        return await Podcast.findOneAndUpdate({
            _id: id,
            author: {$ne: liker}
        }, {
            $push: {
                likes: {
                    liked_by: liker,
                    timestamp: new Date()
                }
            }
        }, {new: true}).exec()
    },

    createNewPodcast: async function (author, podcast) {
        return await new Podcast({
            title: podcast.title,
            description: podcast.description,
            timestamp: podcast.timestamp,
            hosts: podcast.hosts,
            tags: podcast.tags,
            status: podcast.status,
            coverImage: podcast.coverImage,
            audioFile: podcast.audioFile,
            "payment.paid": podcast.paid
        }).save()

    },
    // saveUploads: async function (path, profile, uploader) {
    //     return await this.storeUpload(path, uploader).then(async upload => {
    //         //create a new podcast of the uploaded file
    //       return await new Podcast({
    //             body: '',
    //             author: uploader,
    //             status: 'original',
    //             timestamp: new Date(),
    //             profile: profile,
    //             uploads: upload._id
    //
    //         }).save()
    //
    //         return podcast
    //     })
    // },
    viewTwinpal: async function (id) {
        return Guard.findOne({
            '_id': id
        }).select('first_name last_name profile_picture podcasts').exec()
    }
    ,
    signup: async function (userInfo) {
        return await new Admin({
            password: bcrypt.hashSync(userInfo.password, 10),
            email: userInfo.email,
            username: userInfo.username,
            profile_picture: 'default.jpg',
            date_joined: new Date()
        }).save()
    },
    registerGuardPersonalDetails: async function (userInfo) {
        return await new Guard({
            guard_id: userInfo.guard_id,
            surname: userInfo.surname,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            dob: userInfo.dob,
            gender: userInfo.gender,
            nationalID: userInfo.nationalID,
            employment_date: userInfo.employment_date,
            password: bcrypt.hashSync(userInfo.password, 10),
            email: userInfo.email,
            profile_picture: 'default.jpg',
            date_joined: new Date()
        }).save()
    },
    /**
     *
     * Tag.findOneAndUpdate({
                    name: tag
                }, {$push: {podcasts: podcast._id}},{upsert:true}).exec()
     })
     */
    registerGuardContactDetails: async function (userInfo) {
        return await new Guard({
            guard_id: userInfo.guard_id,
            surname: userInfo.surname,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            dob: userInfo.dob,
            gender: userInfo.gender,
            nationalID: userInfo.nationalID,
            employment_date: userInfo.employment_date,
            password: bcrypt.hashSync(userInfo.password, 10),
            email: userInfo.email,
            profile_picture: 'default.jpg',
            date_joined: new Date()
        }).save()
    },
    addLocation: async function (location) {
        return await new Location({
            name: location.name,
            date_joined: new Date()
        }).save()
    }
    ,
// findComments: async function (podcast_id) {
//     return await Comment.find({podcast: podcast_id}).select('author body timestamp').exec()
//
// },
    findPodcasts: async function (ctx) {
        return await Podcast.find({
            $or: [{
                author: ctx.currentGuard.id,
            },
                {
                    profile: ctx.currentGuard.id
                }]
        }).populate('uploads').populate('author', 'username profile_picture').populate('profile', 'username profile_picture').limit(2).exec()
    },
    findGuardPodcasts: async function (args) {
        // return await Guard.findById(args).select("podcasts").sort({timestamp: -1}).exec()
        return await Podcast.find({
            $or: [{
                author: args,
            },
                {
                    profile: args
                },]
        }).sort({timestamp: -1}).exec()
    }
    ,
    findGuardUploads: async function (args) {
        return await Guard.findById(args._id).select("uploads").sort({timestamp: -1}).exec()
    }
    ,
    fetchNewsFeed: async function (ctx) {
        return await Podcast.find({
            $or: [{
                author: id,
            },
                {
                    profile: id
                },]
        }).populate('uploads').populate('author', 'username profile_picture').populate('profile', 'username profile_picture').limit(2).exec()
    }
    ,

    storeProfilePicture: async function (path, uploader) {
        return await Guard.findOneAndUpdate({
            _id: uploader,
        }, {profile_picture: path}).exec()
    }
    ,
    findTwinpals: async function (args) {
        return await Guard.find({
            'birthday': args.birthday
        }).where('_id').ne(args.id).exec()
    }
    ,
    findGuards: async function () {
        return await Guard.find({}).exec()
    }
    ,
    findAllPodcasts: async function () {
        return await Podcast.find({}).sort({timestamp: -1}).exec()
    }
    ,
    findAllHosts: async function () {
        return await Guard.find({role:'host'}).exec()
    } ,
    findAllLocations: async function () {
        return await Location.find().exec()
    } ,

    findAllGuards: async function () {
        return await Guard.find({}).exec()
    }
    ,
    findPodcast: async function (args) {
        return await Podcast.findById(args.id).exec()
    }
    ,
    findPodcastLikes: async function (args) {
        return await Podcast.findById(args._id).select('likes').exec()
    }
    ,
    findPodcastComments: async function (args) {
        return await Comment.find({podcast: args}).sort({timestamp: -1}).exec()
    }
    ,
    findComment: async function (args) {
        return await Comment.findById(args.id).exec()
    }
    ,
    findLikedPodcasts: async function (args) {
        return await Guard.findById(args.id).select('liked_podcasts').exec()
    }
    ,
    findUpload: async function (args) {
        return await Upload.findById(args.id).exec()
    }
    ,
    findGuard: async function (args) {
        return await Guard.findById(args.id).exec()
    }
    ,
    isGuardExists: async function (args) {
        return await Guard.findOne({email: args.email}).exec()
    },
    isLocationExists: async function (args) {
        return await Location.findOne({name: args.name}).exec()
    }
    ,
    findPodcastFile: async function (args) {
        return await Podcast.findById(args._id).select('audioFile').exec()
    },
    findPodcastCoverImage: async function (args) {
        return await Podcast.findById(args._id).select('coverImage').exec()
    },
    findAllTags:async function(){
        return await Tag.find({}).exec()
    },
    findTaggedPodcasts:async function(tag_id){
        return await Tag.findById(tag_id).select("podcasts").exec()
    }
}
module.exports = queries

//TODO add podcasts that a person writes, and ones written on their wall to be inside the podcast array of one's document(record)