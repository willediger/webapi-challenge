const express = require("express");

const router = express.Router();
const db = require("../data/helpers/projectModel.js");
// const actionDb = require("../data/helpers/actionModel.js");

router.post("/", validateProject, async (req, res) => {
  const project = await db.insert(req.body);
  if (project) {
    res.status(200).json(project);
  } else {
    next({
      status: 500,
      message: "The project could not be added."
    });
  }
});

// router.post("/:id/actions", validateUserId, validatePost, async (req, res) => {
//   const actionToAdd = { project_id: req.params.id, text: req.body.text };
//   const action = await actionDb.insert(actionToAdd);
//   if (action) {
//     res.status(200).json(action);
//   } else {
//     next({
//       status: 500,
//       message: "The action could not be added."
//     });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch {
    next({
      status: 500,
      message: "The projects could not be retrieved."
    });
  }
});

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectId, async (req, res) => {
  const actions = await db.getProjectActions(req.params.id);
  if (actions) {
    res.status(200).json(actions);
  } else {
    next({
      status: 500,
      message: "The project's actions could not be retrieved."
    });
  }
});

// router.delete("/:id", validateUserId, async (req, res) => {
//   const deletedUser = await db.remove(req.params.id);
//   if (deletedUser) {
//     res.status(200).json(req.user);
//   } else {
//     next({
//       status: 500,
//       message: "The user information could not be removed."
//     });
//   }
// });

// router.put("/:id", validateUserId, validateUser, async (req, res) => {
//   const updatedUser = await db.update(req.params.id, req.body);
//   if (updatedUser) {
//     res.status(200).json(updatedUser);
//   } else {
//     next({
//       status: 500,
//       message: "The user information could not be updated."
//     });
//   }
// });

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const project = await db.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      next({
        status: 404,
        message: "The project with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The project information could not be retrieved."
    });
  }
}

function validateProject(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.name && req.body.description) {
      next();
    }
    if (!req.body.name && req.body.description) {
      next({
        status: 400,
        message: "missing required name field"
      });
    }
    if (!req.body.name && req.body.description) {
      next({
        status: 400,
        message: "missing required description field"
      });
    }
    if (!req.body.name && !req.body.description) {
      next({
        status: 400,
        message: "missing required name & description fields"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing project data"
    });
  }
}

// function validatePost(req, res, next) {
//   if (req.body && Object.keys(req.body).length > 0) {
//     if (req.body.text) {
//       next();
//     } else {
//       next({
//         status: 400,
//         message: "missing required text field"
//       });
//     }
//   } else {
//     next({
//       status: 400,
//       message: "missing post data"
//     });
//   }
// }

module.exports = router;
