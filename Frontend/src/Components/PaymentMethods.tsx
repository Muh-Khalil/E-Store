import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchPaymentConfig } from "../store/paymentSlice"
import { selectPaymentMethods } from "../store/selectors"

export default function PaymentMethods() {
  const dispatch = useAppDispatch()
  const methods = useAppSelector(selectPaymentMethods)

  useEffect(() => { dispatch(fetchPaymentConfig()) }, [dispatch])

  return (
    <div className="flex flex-col gap-3">
      {methods.filter(m => m.enabled).map(m => (
        <label key={m.id} className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" value={m.id} className="accent-[#E8420A]" />
          <span className="text-gray-700">{m.name}</span>
        </label>
      ))}
    </div>
  )
}
