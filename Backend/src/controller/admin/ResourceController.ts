import { Request, Response } from 'express';
import Resource, { sectionProps } from '../../model/Resource';
import mongoose from 'mongoose';
import Quiz, { quizProps } from '../../model/Quiz';
import { randomUUID } from 'crypto';

//add backend validation

//Get resource associated with each object
const GetResource = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const resultResource = await Resource.findOne({
      chapterId: new mongoose.Types.ObjectId(chapterId as string),
    });
    if (resultResource) {
      res.status(200).json({ message: 'success', resource: resultResource });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};
const AddResource = async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;
    const resource = req.body as sectionProps;
    resource._id = randomUUID();
    const addResource = await Resource.findById(resourceId);
    if (addResource) {
      addResource.Section.push(resource);
      await addResource.save();
      const newResource = await Resource.findById(addResource)
      res.status(200).json({ message: 'success', resource: newResource, section: resource });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

const EditResource = async (req: Request, res: Response) => {
  try {
    const resource = req.body as sectionProps;
    const { resourceId, sectionId } = req.params;
    const updateResource = await Resource.findById(resourceId);
    if (updateResource) {
      updateResource.Section.forEach((section) => {
        if (section._id === sectionId) {
          section.sectionName = resource.sectionName;
          section.content = resource.content;
        }
      });
      await updateResource.save();
      const newResource = await Resource.findById(updateResource.id)
      res.status(200).json({ message: 'success', resource: newResource });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteResource = async (req: Request, res: Response) => {
  try {
    const { resourceId, sectionId } = req.params;
    const deleteResource = await Resource.findById(resourceId);
    if (deleteResource) {
      deleteResource.Section = deleteResource.Section.filter(
        (section) => section._id !== sectionId
      );
      await deleteResource.save();
      const newResource=await Resource.findById(resourceId)
      res.status(200).json({ message: 'success', resource: newResource });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//get quiz associated with each chapter
const GetQuiz = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const resultQuiz = await Quiz.findOne({
      chapterId: new mongoose.Types.ObjectId(chapterId as string),
    });
    if (resultQuiz) {
      res.status(200).json({ message: 'success', quiz: resultQuiz });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};
//post method implementations
const AddQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const quizBody = req.body as quizProps;
    console.log(quizBody);
    const addQuiz = await Quiz.findById(quizId);
    if (addQuiz) {
      addQuiz.Quiz.push(quizBody);
      await addQuiz.save();
      const newQuiz=await Quiz.findById(quizId)
      res.status(200).json({ message: 'success', quiz:newQuiz });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};
//edit resource here

//edit quiz here
const EditQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, questionId } = req.params;
    const quizBody = req.body as quizProps;

    const updateQuiz = await Quiz.findById(quizId);
    if (updateQuiz) {
      updateQuiz.Quiz.forEach((quiz) => {
        if (quiz._id === questionId) {
          quiz.question = quizBody.question ?? quiz.question;
          quiz.answer = quizBody.answer ?? quiz.answer;
          quiz.reward = quizBody.reward ?? quiz.reward;
          quiz.options = quizBody.options ?? quiz.options;
          quiz.multiselect = quizBody.multiselect ?? quiz.multiselect;
        }
      });
      await updateQuiz.save();
      const newQuiz=await Quiz.findById(quizId)
      res.status(200).json({ message: 'success', quiz:newQuiz });
    } else {
      res.status(404).json({ message: 'success' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, questionId } = req.params;
    const deleteQuiz = await Quiz.findById(quizId);
    if (deleteQuiz) {
      deleteQuiz.Quiz = deleteQuiz.Quiz.filter(
        (quiz) => quiz._id !== questionId
      );
      await deleteQuiz.save();
      const newQuiz=await Quiz.findById(quizId)
      res.status(200).json({ message: 'success', quiz:newQuiz });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetResource,
  AddResource,
  EditResource,
  DeleteResource,
  GetQuiz,
  AddQuiz,
  EditQuiz,
  DeleteQuiz,
};
