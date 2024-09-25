import { Request, Response } from 'express';
import Quiz from '../../../model/Quiz';
import { IUser } from '../../../model/User';
import Wallet from '../../../model/Wallet';
import mongoose from 'mongoose';
import Progress from '../../../model/Progress';
import Roadmap from '../../../model/Roadmap';

interface responseProps {
  question: string;
  reward: number;
}

/*
  Include an option to update the progress as needed 
  Migrate from existing method onto transaction based system
*/
const QuizChecker = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    //we have the quizId here dont forget to think about that case as well
    const user = req.user as IUser;
    let attended: boolean = user.attendedQuizes.includes(
      new mongoose.Types.ObjectId(quizId)
    );
    const quizBody: Record<string, string> = req.body;
    const checkQuiz = await Quiz.findById(quizId);
    const resultJson: responseProps[] = [];
    let finalReward = 0;
    if (checkQuiz) {
      checkQuiz.Quiz.map((quiz) => {
        if (quiz.answer === quizBody[quiz.question]) {
          resultJson.push({ question: quiz.question, reward: quiz.reward });
          finalReward += quiz.reward;
        } else {
          resultJson.push({ question: quiz.question, reward: 0 });
        }
      });
      if (!attended) {
        //to the progress module initial creation maybe three db queries be necessary

        // console.log(updateProgress)
        //now from here onto wallet as well
        user.rewardPoints += finalReward;
        const updateWallet = await Wallet.findOne({ userId: user.id });
        if (updateWallet) {
          updateWallet.balance += finalReward;
          updateWallet.history.push({
            paymentDate: new Date(),
            type: 'reward',
            amount: finalReward,
            status: true,
          });
          await updateWallet.save();
        } else {
          res.status(404).json({ message: 'resource not found' });
          return;
        }
        user.attendedQuizes.push(checkQuiz.id);
        await user.save();
      }
      const courseId = (await Roadmap.findById(checkQuiz.roadmapId))?.courseId;
      if (!courseId)
        return res.status(404).json({ message: 'course not found' });
      const updateProgress = await Progress.findOne({ courseId: courseId });
      if (updateProgress) {
        updateProgress.progress.push({
          roadmapId: checkQuiz.roadmapId,
          quizes: [
            {
              quizId: quizId,
              reward: finalReward,
            },
          ],
        });
        updateProgress.save();
      } else {
        return res
          .status(404)
          .json({ messsage: 'progress collection not found' });
      }

      res.status(200).json({
        message: 'success',
        result: resultJson,
        finalReward: finalReward,
      });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  QuizChecker,
};
