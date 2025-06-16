const {User, Board, BoardInvitation, BoardMember} =  require('../models');

exports.sendInvitation = async (req, res) => {
    const {email} = req.body;
    const {boardId} =  req.params;
    const invitedBy = req.user.id;

    try {
        const board = await Board.findByPk(boardId);
        if(!board || board.createdBy !== invitedBy){
            return res.status(403).json({message: 'Unauthorized or board not found'});
        }
        const invitedUser = await User.findOne({where: {email}});
        if(!invitedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        if(invitedUser.id === invitedBy) {
            return res.status(400).json({message: 'Cannot invite yourself'});
        }
        const alreadyMember = await BoardMember.findOne({
            where: {boardId, userId: invitedUser.id},
        });
        if(alreadyMember){
            return res.status(400).json({message: 'User is already a member'});
        }

        const alreadyInvited = await BoardInvitation.findOne({
            where: {
                boardId, 
                invitedUserId: invitedUser.id,
                status: 'pending',
            }
        });
        if(alreadyInvited){
            return res.status(400).json({message: 'User is already invited'});
        }
        await BoardInvitation.create({
            boardId,
            invitedBy,
            invitedUserId: invitedUser.id,
        });
        res.status(200).json({message: 'Invitation sent successfully'});
    } catch(err){
        console.error('Send Invitation Error: ', err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

exports.getInvitations = async (req, res) => {
    try {
        const invitations = await BoardInvitation.findAll({
            where: {
                inviteedUserId: req.user.id,
                status: 'pending',
            },
            include: [
                {
                    model: Board,
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: User,
                    as: 'Inviter',
                    attributes: ['id', 'email']
                }
            ]
        });
        res.status(200).json(invitations);
    } catch(err){
        console.error('Fetch Invitations Error: ', err);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.respondInvitation = async (req, res) => {
    const {invitationId} = req.params;
    const {response} = req.body;

    try {
        const invitation = await BoardInvitation.findByPk(invitationId);
        if(!invitation || invitation.invitedUserId !== req.user.id) {
            return res.status(404).json({message: 'Invitation not found'});
        }
        if(invitation.status !== 'pending'){
            return res.status(400).json({message: 'Invitation already responded to'});
        }
        invitation.status = response;
        await invitation.save();

        if(response === 'accepted') {
            await BoardMember.create({
                boardId: invitation.boardId,
                userId: req.user.id,
                role: 'member',
            });
        }

        res.status(200).json({message: 'Invitation ${response'});
    } catch(err){
        console.error('Respond Invitation Error: ', err);
        res.status(500).json({message: "Internal server error"});
    }
};