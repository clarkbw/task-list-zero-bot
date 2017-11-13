const plugin = require('..');

const { createRobot } = require('probot');

describe('block-on-task-list', () => {
  let robot;
  let github;

  beforeEach(() => {
    robot = createRobot();
    plugin(robot);

    github = {
      repos: {
        createStatus: jest.fn(() => Promise.resolve())
      }
    };

    robot.auth = () => Promise.resolve(github);
  });

  describe('listens to correct events', () => {
    beforeEach(() => {
      github.repos.createStatus.mockReset();
    });

    it('creates a status when a PR is edited', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'edited',
          pull_request: {
            title: 'title',
            body: 'body',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
    });
    it('creates a status when a PR is opened', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'opened',
          pull_request: {
            title: 'title',
            body: 'body',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
    });
    it('creates a status when a PR is reopened', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'reopened',
          pull_request: {
            title: 'title',
            body: 'body',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
    });
  });

  describe('correctly sets status', () => {
    beforeEach(() => {
      github.repos.createStatus.mockReset();
    });

    it('does not block when checkboxes are not present', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'edited',
          pull_request: {
            title: 'title',
            body: 'This is the text of a PR',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.repos.createStatus.mock.calls[0][0].state).toEqual(
        'success'
      );
    });
    it('does not block when checked checkboxes are present', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'edited',
          pull_request: {
            title: 'title',
            body: 'Text text text\r\n\r\n- [x] 1st item\r\n- [x] 2nd item\r\n',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.repos.createStatus.mock.calls[0][0].state).toEqual(
        'success'
      );
    });
    it('does block when some checkboxes are unchecked', async () => {
      // Simulates delivery of a payload
      await robot.receive({
        event: 'pull_request',
        payload: {
          action: 'edited',
          pull_request: {
            title: 'title',
            body:
              'Text text text\r\n\r\n- [x] 1st item\r\n- [ ] 2nd item\r\n- [x] 3rd item\r\n',
            head: {
              sha: '0781b461a8c12ac1ac8b2d511cb7621fbf1160ea'
            }
          },
          repository: {
            owner: {
              login: 'clarkbw'
            }
          },
          installation: {
            id: 64798
          }
        }
      });
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.repos.createStatus.mock.calls[0][0].state).toEqual(
        'pending'
      );
    });
  });
});
