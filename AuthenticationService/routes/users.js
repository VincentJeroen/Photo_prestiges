import { Router } from 'express';

import User from '../models/user.js';

var userRouter = Router();

async function get(req, res) {
   try {
      const entry = await User.findById(req.params.id);
      res.json(entry);
   } catch (error) {
      res.status(500).json(error);
   }
}

async function getAll(req, res) {
   try {
      const entries = await User.find({});
      res.json(entries);
   } catch (error) {
      res.status(500).json(error);
   }
}

async function create(req, res) {
   try {
      const newEntry = new User(req.body);
      const savedEntry = await newEntry.save();
      res.status(201).json(savedEntry);
   } catch (error) {
      res.status(500).json(error);
   }
}

async function update(req, res) {
   try {
      if (!req.body.name) {
         return res.status(400).json({ error: 'Name is required' });
      }
      
      const updatedEntry = await User.findByIdAndUpdate(
         req.params.id,
         { $set: { name: req.body.name } },
         { new: true }
      );

      if (!updatedEntry) {
         return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedEntry);
   } catch (error) {
      res.status(500).json(error);
   }
}

async function remove(req, res) {
   try {
      const result =  await User.deleteOne({ _id: req.params.id });

      if (result.deletedCount === 0) {
         return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted' });
   } catch (error) {
      res.status(500).json(error);
   }
}

userRouter.route('/')
   .get(getAll)
   .post(create);

userRouter.route('/:id')
   .get(get)
   .put(update)
   .delete(remove);

export default userRouter;