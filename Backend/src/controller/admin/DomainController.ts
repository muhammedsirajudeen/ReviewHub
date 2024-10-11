import { Request, Response } from 'express';
import Domain, { IDomain } from '../../model/Domain';
import {
  spaceValidator,
  specialCharValidator,
} from '../../helper/validationHelper';

const AddDomain = async (req: Request, res: Response) => {
  try {
    const domain = req.body as IDomain;
    if (spaceValidator(domain.domain)) {
      return res.status(400).json({ message: 'bad request' });
    }
    if (specialCharValidator(domain.domain)) {
      return res.status(400).json({ message: 'bad request' });
    }
    if (domain.domain.length <= 4) {
      return res.status(400).json({ message: 'bad request' });
    }

    const newDomain = new Domain({
      domain: domain.domain,
    });
    await newDomain.save();
    res.status(201).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};
const DeleteDomain = async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    await Domain.deleteOne({ domain: domain });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const GetDomain = async (req: Request, res: Response) => {
  try {
    const domain = await Domain.find();
    res.status(200).json({ message: 'success', domain: domain });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const EditDomain = async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const domainBody = req.body as IDomain;
    if (spaceValidator(domainBody.domain)) {
      return res.status(400).json({ message: 'bad request' });
    }
    if (specialCharValidator(domainBody.domain)) {
      return res.status(400).json({ message: 'bad request' });
    }
    if (domainBody.domain.length <= 4) {
      return res.status(400).json({ message: 'bad request' });
    }
    const updateDomain = await Domain.findOne({ domain: domain });
    if (updateDomain) {
      updateDomain.domain = domainBody.domain;
      await updateDomain.save();
      res.status(200).json({ message: 'success' });
    } else {
      res.status(404).json({ message: 'resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  AddDomain,
  GetDomain,
  DeleteDomain,
  EditDomain,
};
