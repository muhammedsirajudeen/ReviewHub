import { Request,Response } from "express";
import Roadmap from "../../model/Roadmap";
const PAGE_LIMIT = 10;

const RoadmapList = async (req: Request, res: Response) => {
  try {
    let { page } = req.query ?? '1';
    let {courseId}=req.params
    const length = (await Roadmap.find({courseId})).length;
    const Roadmaps = await Roadmap.find({courseId})
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    res
      .status(200)
      .json({
        message: 'success',
        roadmaps: Roadmaps ?? [],
        pageLength: length,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};
export default {
    RoadmapList
}