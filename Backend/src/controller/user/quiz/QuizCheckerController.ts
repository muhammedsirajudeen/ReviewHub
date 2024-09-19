import { Request, Response } from 'express';
import Quiz from '../../../model/Quiz';

const QuizChecker = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const quizBody: Record<string, string> = req.body;
    const checkQuiz = await Quiz.findById(quizId);
    const resultJson:Record<string,number>={}
    let finalReward=0
    if (checkQuiz) {
      checkQuiz.Quiz.map((quiz) => {
        if (quiz.answer === quizBody[quiz.question]) {
          console.log('hell yeah');
          resultJson[quiz.question]=quiz.reward
          finalReward+=quiz.reward
        }else{
            resultJson[quiz.question]=-1
        }
      });
      //now from here onto wallet as well
      res.status(200).json({ message: 'success',result:resultJson, finalReward:finalReward});
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
