const Hotel = require('../../models/hotel/Hotel');
const Room = require('../../models/hotel/Room');
const HotelCoupon = require('../../models/hotel/HotelCoupon');

const createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json({ success: true, hotel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.json({ success: true, hotels });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getPendingHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ success: true, hotels });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getApprovedHotels = async (req, res) => {
    try {
        const { destination } = req.query;
        let query = { status: 'approved' };

        if (destination) {
            const searchRegex = new RegExp(destination, 'i');
            query.$or = [
                { city: searchRegex },
                { address: searchRegex },
                { hotelName: searchRegex }
            ];
        }

        const hotels = await Hotel.find(query).lean().sort({ createdAt: -1 });
        const hotelIds = hotels.map(h => h._id);

        // Fetch active coupons for these hotels
        const now = new Date();
        const allCoupons = await HotelCoupon.find({
            hotelId: { $in: hotelIds },
            status: 'active',
            expiryDate: { $gt: now }
        }).lean();

        // Fetch rooms to determine average/starting price per hotel
        const rooms = await Room.find({ hotelId: { $in: hotelIds } }).lean();

        // Map rooms by hotelId
        const roomsByHotelMap = rooms.reduce((acc, room) => {
            const hid = room.hotelId.toString();
            if (!acc[hid]) acc[hid] = [];
            acc[hid].push(room);
            return acc;
        }, {});

        // Map best coupon per hotel
        const bestCouponMap = allCoupons.reduce((acc, coupon) => {
            const hid = coupon.hotelId.toString();
            
            // Check usage limit
            if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) return acc;

            const currentBest = acc[hid];
            if (!currentBest) {
                acc[hid] = coupon;
            } else {
                // Logic to pick "best": simple comparison of discountValue
                // Note: This logic could be more complex if mix of percentage/flat
                // but usually flat is higher value than percentage for small values.
                // Assuming the user wants higher discount value displayed.
                if (coupon.discountValue > currentBest.discountValue) {
                    acc[hid] = coupon;
                }
            }
            return acc;
        }, {});

        // Attach starting price and best coupon
        const hotelsWithDeals = hotels.map(hotel => {
            const hRooms = roomsByHotelMap[hotel._id.toString()] || [];
            let startingPrice = null;
            if (hRooms.length > 0) {
                startingPrice = Math.min(...hRooms.map(r => r.price || Infinity));
                if (startingPrice === Infinity) startingPrice = null;
            }
            
            return {
                ...hotel,
                startingPrice,
                coupon: bestCouponMap[hotel._id.toString()] || null
            };
        });

        res.json({ success: true, hotels: hotelsWithDeals });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getRejectedHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: 'rejected' }).sort({ createdAt: -1 });
        res.json({ success: true, hotels });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

        const rooms = await Room.find({ hotelId: req.params.id });

        res.json({ success: true, hotel, rooms });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const approveHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { status: 'approved', rejectionReason: '' },
            { new: true }
        );
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, hotel, message: 'Hotel approved successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const rejectHotel = async (req, res) => {
    try {
        const { reason } = req.body;
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected', rejectionReason: reason || 'Rejected by admin' },
            { new: true }
        );
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, hotel, message: 'Hotel rejected' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const blockHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { isBlocked: true },
            { new: true }
        );
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, hotel, message: 'Hotel blocked' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const unblockHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { isBlocked: false },
            { new: true }
        );
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, hotel, message: 'Hotel unblocked' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteHotel = async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        await Room.deleteMany({ hotelId: req.params.id });
        res.json({ success: true, message: 'Hotel deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createHotel,
    getAllHotels,
    getPendingHotels,
    getApprovedHotels,
    getRejectedHotels,
    getHotelById,
    approveHotel,
    rejectHotel,
    blockHotel,
    unblockHotel,
    deleteHotel,
};
