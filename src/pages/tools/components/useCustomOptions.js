import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import handleApi from "../../../libs/handleAPi"

/**
 * Hook that manages the shared (global) custom plan-name / promo-campaign lists.
 * Each list item has shape { _id, value, mine } where `mine` indicates if the
 * current user is the creator (i.e. allowed to delete it).
 */
const useCustomOptions = () => {
    const [planList, setPlanList] = useState([])
    const [promoList, setPromoList] = useState([])

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const resp = await handleApi("/checkout/custom-options", "GET")
                if (!mounted) return
                if (resp?.success && resp.data) {
                    setPlanList(
                        Array.isArray(resp.data.planNames) ? resp.data.planNames : []
                    )
                    setPromoList(
                        Array.isArray(resp.data.promoCampaignIds)
                            ? resp.data.promoCampaignIds
                            : []
                    )
                }
            } catch (err) {
                console.error("loadCustomOptions failed", err)
            }
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const addOption = useCallback(async (type, value) => {
        try {
            const resp = await handleApi("/checkout/custom-options", "POST", {
                type,
                value
            })
            if (!resp?.success || !resp.data) {
                toast.error(resp?.error || "Failed to add")
                return null
            }
            const item = resp.data
            const updater = (list) => {
                if (list.some((x) => x._id === item._id)) return list
                return [...list, item]
            }
            if (type === "planName") setPlanList(updater)
            else if (type === "promoCampaignId") setPromoList(updater)
            return item
        } catch (err) {
            console.error("addCustomOption failed", err)
            toast.error("Failed to add")
            return null
        }
    }, [])

    const removeOption = useCallback(async (type, id) => {
        try {
            const resp = await handleApi(
                `/checkout/custom-options/${id}`,
                "DELETE"
            )
            if (!resp?.success) {
                toast.error(resp?.error || "Failed to remove")
                return false
            }
            if (type === "planName") {
                setPlanList((l) => l.filter((x) => x._id !== id))
            } else if (type === "promoCampaignId") {
                setPromoList((l) => l.filter((x) => x._id !== id))
            }
            return true
        } catch (err) {
            console.error("removeCustomOption failed", err)
            toast.error("Failed to remove")
            return false
        }
    }, [])

    return {
        planList,
        promoList,
        addOption,
        removeOption
    }
}

export default useCustomOptions
