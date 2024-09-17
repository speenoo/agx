use core::slice;
use std::borrow::Cow;
use std::ffi::CStr;
use std::time::Duration;

use crate::bindings;
use crate::error::Error;

use serde::ser::{Serialize, SerializeStruct, Serializer};

#[derive(Clone)]
pub struct QueryResult(pub(crate) *mut bindings::local_result_v2);

impl QueryResult {
    pub fn data_utf8(&self) -> Result<String, Error> {
        String::from_utf8(self.data_ref().to_vec())
            .map_err(|e| Error::NonUtf8Sequence(e.to_string()))
    }

    pub fn data_utf8_lossy<'a>(&'a self) -> Cow<'a, str> {
        String::from_utf8_lossy(self.data_ref())
    }

    pub fn data_utf8_unchecked(&self) -> String {
        unsafe { String::from_utf8_unchecked(self.data_ref().to_vec()) }
    }

    pub fn data_ref(&self) -> &[u8] {
        let buf = unsafe { (*self.0).buf };
        let len = unsafe { (*self.0).len };
        let bytes: &[u8] = unsafe { slice::from_raw_parts(buf as *const u8, len) };
        bytes
    }

    pub fn rows_read(&self) -> u64 {
        (unsafe { *self.0 }).rows_read
    }

    pub fn bytes_read(&self) -> u64 {
        unsafe { (*self.0).bytes_read }
    }

    pub fn elapsed(&self) -> Duration {
        let elapsed = unsafe { (*self.0).elapsed };
        Duration::from_secs_f64(elapsed)
    }

    pub(crate) fn check_error(self) -> Result<Self, Error> {
        let err_ptr = unsafe { (*self.0).error_message };

        if err_ptr.is_null() {
            return Ok(self);
        }

        Err(Error::QueryError(unsafe {
            CStr::from_ptr(err_ptr).to_string_lossy().to_string()
        }))
    }
}

impl Drop for QueryResult {
    fn drop(&mut self) {
        unsafe { bindings::free_result_v2(self.0) };
    }
}

impl Serialize for QueryResult {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("QueryResult", 4)?;

        state.serialize_field(
            "data_utf8",
            &self.data_utf8().unwrap_or_else(|_| String::from("")),
        )?;
        state.serialize_field("rows_read", &self.rows_read())?;
        state.serialize_field("bytes_read", &self.bytes_read())?;
        state.serialize_field("elapsed", &self.elapsed().as_secs_f64())?;

        state.end()
    }
}
