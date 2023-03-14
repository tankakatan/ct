const rescale = (
    x: number,
    src_min: number,
    src_max: number,
    dst_min: number,
    dst_max: number,
) => (
    dst_min + (x - src_min) * (dst_max - dst_min) / (src_max - src_min)
);

export default rescale;
