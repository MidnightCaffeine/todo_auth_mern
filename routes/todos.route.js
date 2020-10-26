const router = require("express").Router();
const auth = require("../middleware/auth");
let Todo = require("../models/Todo");

router.route("/").get((req, res) => {
  Todo.find()
    .then((todos) => res.json(todos))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post(auth, (req, res) => {
  const { value } = req.body;

  const newTodo = new Todo({ value });

  newTodo
    .save()
    .then(() => res.json("Todo added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete(auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) throw Error("No todo found");

    const removed = await todo.remove();
    if (!removed)
      throw Error("Something went wrong while trying to delete the item");

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

router.route("/update/:id").post(auth, async (req, res) => {
  try {
    const { value } = req.body;
    const updated = await Todo.updateOne(
      { _id: req.params.id },
      { value: value }
    );
    if (!updated)
      throw Error("Something went wrong while trying to update the item");
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
