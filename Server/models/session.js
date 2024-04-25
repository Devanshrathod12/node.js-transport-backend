import Sequelize from 'sequelize';

const SessionModel = (sequelize) => {
  const Session = sequelize.define('Session', {
     userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          RelationShips: {
              model: 'User',
              key: 'id',
          },
     },
      token: {
          type: Sequelize.STRING,
          allowNull: true,
     },
      status: {
          type: Sequelize.STRING,
          allowNull: true,
     },
  });

  return Session;
};

export default SessionModel;
