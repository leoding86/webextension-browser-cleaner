function ScheduledTask () {
  this.intervalTime,
  this.taskTimeout,
  this.task,
  this.status = ScheduledTask.IDLE;
  this.debug = false;

  this.setIntervalTime = function (time) {
    if (/[1-9]\d{3,}/.test(time)) {
      this.log('Update task interval to ' + time);

      this.intervalTime = time;
    } else {
      this.log('Interval time must be greater then 1000');
    }

    return this;
  }

  this.restart = function () {
    this.status = ScheduledTask.IDLE;

    this.run();
  }

  this.run = function () {
    var self = this;

    if (typeof this.task.handle === 'function' && this.status !== ScheduledTask.STOP && this.intervalTime >= 1000) {
      this.log('Run task ' + this.getTaskName());

      this.task.handle.call(this.task).then(function () {
        self.log('Task is complete ' + self.getTaskName());

        self.status = ScheduledTask.COMPLETE;
      }).catch(function () {
        self.log('Task is failure ' + self.getTaskName());

        self.status = ScheduledTask.FAILURE;
      }).finally(function () {
        self.scheduleNext();
      });
    }
  }

  this.scheduleNext = function () {
    var self = this;

    this.taskTimeout = setTimeout(function () {
      self.run();
    }, this.intervalTime);

    this.log('Run task ' + this.getTaskName() + ' in ' + this.intervalTime + ' seconds');

    this.status = ScheduledTask.WAITING;
  }

  this.stop = function () {
    this.log('Stop task ' + this.getTaskName());

    this.status = ScheduledTask.STOP;

    if (this.taskTimeout) {
      clearTimeout(this.taskTimeout);
    }
  }

  this.getTaskName = function () {
    return this.task.constructor.name;
  }

  this.log = function(message) {
    if (this.debug) {
      console.log('[' + Date().toString() + ']' + message);
    }
  }
}

ScheduledTask.IDLE = 1;

ScheduledTask.WAITING = 1 << 1;

ScheduledTask.COMPLETE = 1 << 2;

ScheduledTask.FAILURE = 1 << 3;

ScheduledTask.STOP = 1 << 4;

module.exports = ScheduledTask;
