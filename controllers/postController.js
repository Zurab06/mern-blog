import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        // { path: "user", select: ["name", "imageUrl"] }
        const allPosts = await PostModel.find().populate('user').exec()
        res.json(allPosts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        const doc = await PostModel.findByIdAndUpdate(
            { _id: postId }, { $inc: { viewsCount: 1 } }, { returnDocument: 'after' },
        )

        if (!doc) {
            return res.status(404).json({
                message: 'не удалось найти статью'
            })
        }
        res.json(doc)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось получить пост'

        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findByIdAndDelete({ _id: postId })
        if (!post) {
            return res.status(404).json({
                message: 'не удалось найти статью для удаления'
            })
        }
        res.json({
            message: 'удалено'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось удалить статью'
        })
    }
}

export const createPost = async (req, res) => {

    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось создать пост'
        })
        
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        res.json({ message: 'статья обновлена' })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось обновить статью'
        })
    }
}

export const getLastTags = async (req,res)=>{
    const posts = await PostModel.find().limit(5).exec()
    const tags = posts.map((obj)=>obj.tags).flat().slice(0,5)

    res.json(tags)
}
