import { Request,Response } from "express";
import Roadmap from "../../model/Roadmap";
import { IUser } from "../../model/User";
const PAGE_LIMIT = 10;

interface dateProps{
  '$gt':Date
}
interface queryProps{
  postedDate?:dateProps,
  courseId:string,
  roadmapName?:RegExp,
  unlistStatus?:boolean
}

const RoadmapList = async (req: Request, res: Response) => {
  try {
    const user=req.user as IUser
    let { page } = req.query ?? '1';
    const {date,search}=req.query
    let {courseId}=req.params
    
    const query:queryProps={courseId:courseId}
    if(user.authorization!=="admin"){
      query.unlistStatus=false
    }
    if(date) query.postedDate={'$gt':new Date(date as string)}
    if(search) query.roadmapName=new RegExp(search as string ,'i')

    const length = (await Roadmap.find(query)).length;
    const Roadmaps = await Roadmap.find(query)
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