import type { Vendor } from "$lib/types";

export function getVendorStats(vendors: Vendor[]) {
  return {
    total: vendors.length,
    researching: vendors.filter((v) => v.vendorStatus === "researching").length,
    contacted: vendors.filter((v) => v.vendorStatus === "contacted").length,
    quoted: vendors.filter((v) => v.vendorStatus === "quoted").length,
    booked: vendors.filter((v) => v.vendorStatus === "booked").length,
  };
}
