import {
    BedDouble,
    Building2,
    User,
} from 'lucide-react'


function formatRupiah(value) {

    return new Intl.NumberFormat('id-ID', {

        style: 'currency',

        currency: 'IDR',

        maximumFractionDigits: 0,

    }).format(
        Number(value) || 0
    )

}


function RoomCard({
    room,
    buildingName,
    floorName,
}) {

    const isOccupied =
        room.status === 'TERISI'


    const statusLabel = {

        TERSEDIA:
            'TERSEDIA',

        TERISI:
            'TERISI',

        NONAKTIF:
            'NONAKTIF',

    }


    const tenantName =
        room.tenantName ||
        room.tenant ||
        room.tenant_name ||
        null


    return (

        <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
        ">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="
                flex
                items-start
                justify-between
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                    ">

                        <BedDouble
                            size={22}
                            className="text-slate-700"
                        />

                    </div>


                    <div>

                        <p className="
                            text-xs
                            text-slate-500
                        ">
                            Nomor Kamar
                        </p>


                        <h3 className="
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            {room.roomNumber}
                        </h3>

                    </div>

                </div>


                {/* STATUS */}

                <span
                    className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium

                        ${isOccupied

                            ? 'bg-blue-100 text-blue-700'

                            : room.status === 'NONAKTIF'

                                ? 'bg-red-100 text-red-700'

                                : 'bg-green-100 text-green-700'
                        }
                    `}
                >

                    {
                        statusLabel[
                        room.status
                        ] ||
                        room.status
                    }

                </span>

            </div>


            {/* =========================================
                LOCATION
            ========================================= */}

            <div className="
                mt-5
                space-y-2
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                ">

                    <Building2 size={16} />

                    <span>
                        {buildingName || '-'}
                    </span>

                </div>


                {floorName && (

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-500
                    ">

                        <span className="ml-6">
                            {floorName}
                        </span>

                    </div>

                )}

            </div>


            {/* =========================================
                TENANT
            ========================================= */}

            <div className="
                mt-5
                border-t
                border-slate-100
                pt-4
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <User
                        size={16}
                        className="text-slate-400"
                    />


                    <div>

                        <p className="
                            text-xs
                            text-slate-400
                        ">
                            Penghuni
                        </p>


                        <p className="
                            text-sm
                            font-medium
                            text-slate-700
                        ">

                            {tenantName ||
                                'Belum ada penghuni'}

                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                PRICE
            ========================================= */}

            <div className="mt-4">

                <p className="
                    text-xs
                    text-slate-400
                ">
                    Harga Sewa
                </p>


                <p className="
                    font-semibold
                    text-slate-800
                ">

                    {formatRupiah(
                        room.rentPrice
                    )}

                    <span className="
                        text-xs
                        font-normal
                        text-slate-400
                    ">

                        {' '}
                        / bulan

                    </span>

                </p>

            </div>

        </div>

    )

}


export default RoomCard