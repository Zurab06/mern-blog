import PostModel from '../models/Post'

export const createPost = async (req,res)=>{

    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось создать пост'
        })
    }
}
